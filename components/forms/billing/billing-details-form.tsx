'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '../../ui/button';
import Image from 'next/image';
import TransactionDetails from '@/components/tables/billing-tables/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PaymentMethod } from '@/types/PaymentMethod';
import {
  fetchPaymentMethodByCustomer,
  fetchSubscriptionExpiry
} from '@/app/api/billing/stripeCustomerApi';
import { useSession } from 'next-auth/react';
import { SubscriptionDetails } from '@/types/Subscription';
import { Elements } from '@stripe/react-stripe-js';
import PaymentMethodModal from '@/components/modal/payment-method-form';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
);

const BillingDetails = () => {
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod[]>([]);
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetails>();
  const [loadingSubscriptionDetails, setLoadingSubscriptionDetails] =
    useState(true);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [open, setOpen] = useState(false);

  const handleChangePayment = (event: any) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const { data: session } = useSession();
  const user: any = session?.user;

  const fetchPaymentMethods = async () => {
    try {
      const stringId = user?.stripe_customer_id;
      const response = await fetchPaymentMethodByCustomer(stringId);
      // console.log(response.data);
      setPaymentMethod(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setPaymentMethod([]);
    } finally {
      setLoadingPaymentMethod(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
    fetchSubScriptionDetails();
  }, []);

  const fetchSubScriptionDetails = async () => {
    try {
      const stringId = user?.stripe_customer_id;
      const response = await fetchSubscriptionExpiry(stringId);
      console.log(response.data);
      setSubscriptionDetails(response.data);
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    } finally {
      setLoadingSubscriptionDetails(false);
    }
  };

  if (loadingSubscriptionDetails) return <div>Loading...</div>;

  return (
    <>
      <Elements stripe={stripePromise}>
        <PaymentMethodModal
          isOpen={open}
          customer_id={user?.stripe_customer_id}
          onClose={() => setOpen(false)}
        />
      </Elements>

      {/* Wrap your component with FormProvider */}
      <div className="flex-1 space-y-4 p-8">
        <div className="rounded-md bg-purple-700 p-8 text-center text-white">
          <p className="text-lg font-medium">
            Your account subscription will expire in{' '}
            {subscriptionDetails?.daysUntilExpiry} days
          </p>
          <p className="mt-2 text-sm">
            To ensure uninterrupted access to Adzeela features and benefits, we
            encourage you to renew your subscription today.
          </p>
        </div>
        {/* content goes here */}
        <h2 className="mb-4 text-lg font-semibold">Payment methods</h2>

        <Card>
          <CardHeader className="text-lg font-bold">
            Choose your payment method
          </CardHeader>
          <div className="flex justify-around">
            <div className="w-1/2">
              <CardContent>
                <div>
                  <h3>Debit / Credit</h3>
                  <Separator className="my-2" />

                  {loadingPaymentMethod ? (
                    <div>Loading...</div>
                  ) : paymentMethod.length > 0 ? (
                    paymentMethod.map((paymentMethod, index) => (
                      <div key={index} className="flex justify-between">
                        <div className="my-3 flex">
                          <Image
                            src={`/media/images/payment/${paymentMethod?.card?.display_brand}.webp`}
                            alt="Adzeela"
                            width="50"
                            height="20"
                            quality="100"
                          />
                          <p className="ml-3 text-xl leading-tight">
                            *****{paymentMethod?.card?.last4}
                            <span className="block text-sm">
                              {paymentMethod?.card?.display_brand}
                            </span>
                            {/* <span className="block text-sm">
                            Expires {paymentMethod?.card?.exp_month}
                            </span> */}
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          value={paymentMethod?.id}
                          checked={selectedPaymentMethod === paymentMethod?.id}
                          onChange={handleChangePayment}
                          className="form-radio text-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    ))
                  ) : (
                    <div>No debit/credit available</div>
                  )}
                </div>

                <div className="mt-5">
                  <h3>E - Wallet</h3>
                  <Separator className="my-2" />
                  <div className="mt-5 flex flex-col leading-loose">
                    {/* <div className="flex justify-between">
                      <div className="flex">
                        <Image
                          src="/media/images/payment/mastercard.webp"
                          alt="Adzeela"
                          width="50"
                          height="20"
                          quality="100"
                        />
                        <p className="ml-3 text-xl leading-tight">
                          091231231231
                          <span className="block text-sm">Gcash</span>
                        </p>
                      </div>
                      <input
                        name="paymentMethod"
                        type="radio"
                        value="mastercard"
                        // checked={field.value === 'mastercard'} // Properly binding value
                      />
                    </div> */}

                    {/* <div className="mt-5 flex justify-between">
                      <div className="flex">
                        <Image
                          src="/media/images/payment/mastercard.webp"
                          alt="Adzeela"
                          width="50"
                          height="20"
                          quality="100"
                        />
                        <p className="ml-3 text-xl leading-tight">
                          091231231231
                          <span className="block text-sm">Maya</span>
                        </p>
                      </div>
                      <input
                        name="paymentMethod"
                        type="radio"
                        value="visa"
                        // checked={field.value === 'visa'} // Properly binding value
                      />
                    </div> */}
                    <div>No e-wallet available</div>
                  </div>
                </div>

                <div className="mb-3 mt-10">
                  <button
                    className="rounded border border-purple-500 px-4 py-1 text-purple-500 transition duration-200 hover:bg-purple-500 hover:text-white"
                    onClick={() => setOpen(true)}
                  >
                    Add Accounts
                  </button>
                </div>
              </CardContent>
            </div>

            <div className="w-1/3">
              <CardContent>
                <h3 className="text-lg font-bold">Order Summary</h3>
                <Separator className="my-2" />
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-purple-500">
                    {subscriptionDetails?.interval} Plan
                  </h3>
                  <p>Expires in {subscriptionDetails?.expiryDate}</p>
                </div>

                <Separator className="my-2" />
                <div className="flex justify-between">
                  <p className="font-bold">Total</p>
                  <h3 className="text-xl font-bold text-yellow-500">
                    ${subscriptionDetails?.amount}
                  </h3>
                </div>
                <div className="flex justify-between">
                  <p className="font-bold">Status</p>
                  <h5 className="text-xl font-bold text-green-500">
                    {subscriptionDetails?.status}
                  </h5>
                </div>

                <p className="my-5">
                  By proceeding to the next step, you agree to adzeela's
                  Agreement Terms
                </p>

                <div className="my-4 flex w-full items-center justify-center">
                  <Link
                    href="/digital-signage/subscription-plans"
                    className="mr-2 mt-7 w-1/2 text-white"
                  >
                    <Button>Upgrade Plan</Button>
                  </Link>

                  <Button
                    // disabled={loading}
                    className="mt-7 w-1/2 text-white"
                    type="submit"
                  >
                    Pay Now
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex-1 px-6">
        <TransactionDetails />
      </div>
    </>
  );
};

export default BillingDetails;
