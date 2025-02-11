'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPlans } from "@/app/api/billing/stripePlanApi";
import { Plan } from "@/types/Plan";
import { containsKeyword } from "@/components/utils/containsKeyword";
import { useSession } from "next-auth/react";

const page = () => {

    const [data, setData] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const none = ['none', 'no', 'etc'];

    const { data: session } = useSession();
    const user: any = session?.user;
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetchPlans();
            console.log(response.data);
            setData(response.data);
          } catch (err) {
            console.error('Error fetching plans:', err);
            setError('Failed to load data');
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
      
          {data.map((plan, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-4 text-center flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-700 mb-2">{plan.name}</h3>
              <p className="text-2xl font-bold text-purple-500">{plan?.amount}</p>
              <p className="text-xs text-gray-500">{plan?.interval + 'ly'}</p>

              <ul className="space-y-4 text-left text-sm my-4">

                {/* For promoters  */}
              {user?.user_type === 'Promoter' ? ( 
                <>
                <li>{!containsKeyword(plan.plan_details?.max_tv_screens || '', none) ? "✔ " : "✖ "}{plan.plan_details?.max_tv_screens}</li>
                <li>{!containsKeyword(plan.plan_details?.advertising || '', none) ? "✔ " : "✖ "}{plan.plan_details?.advertising}</li>
                <li>{!containsKeyword(plan.plan_details?.playlist_creation || '', none) ? "✔ " : "✖ "}{plan.plan_details?.playlist_creation}</li>
                <li>{!containsKeyword(plan.plan_details?.content_scheduling || '', none) ? "✔ " : "✖ "}{plan.plan_details?.content_scheduling}</li>
                <li>{!containsKeyword(plan.plan_details?.additional_users || '', none) ? "✔ " : "✖ "}{plan.plan_details?.additional_users}</li>
                <li>{!containsKeyword(plan.plan_details?.analytics_insights || '', none) ? "✔ " : "✖ "}{plan.plan_details?.analytics_insights}</li>
                <li>{!containsKeyword(plan.plan_details?.support_details || '', none) ? "✔ " : "✖ "}{plan.plan_details?.support_details}</li>
                </>
              )
              :
              (
                <>
                <li>{!containsKeyword(plan.plan_details?.ads_limit || '', none) ? "✔ " : "✖ "}{plan.plan_details?.ads_limit}</li>
                <li>{!containsKeyword(plan.plan_details?.advertising_areas || '', none) ? "✔ " : "✖ "}{plan.plan_details?.advertising_areas}</li>
                <li>{!containsKeyword(plan.plan_details?.scheduling_options || '', none) ? "✔ " : "✖ "}{plan.plan_details?.scheduling_options}</li>
                <li>{!containsKeyword(plan.plan_details?.playlist_creation || '', none) ? "✔ " : "✖ "}{plan.plan_details?.playlist_creation}</li>
                <li>{!containsKeyword(plan.plan_details?.analytics_reporting || '', none) ? "✔ " : "✖ "}{plan.plan_details?.analytics_reporting}</li>
                <li>{!containsKeyword(plan.plan_details?.priority_support || '', none) ? "✔ " : "✖ "}{plan.plan_details?.priority_support}</li> 
                </>
              )}
              </ul>

              {/* change add to [id] */}
              <Link href={`/digital-signage/subscription-plans/${plan.id}`}>

                <button
                  className={`mt-auto px-4 py-2 font-medium text-white rounded-md ${
                    plan.is_current_plan
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-500"
                  }`}
                  disabled={plan.is_current_plan}
                >
                  {plan.is_current_plan ? 'CURRENT PLAN' : 'UPGRADE'}
                </button>

              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
