import Link from "next/link";

import { fetchGoals } from "../utils/fetch-helpers";
import Logo from "../components/logo";

export async function getServerSideProps() {
  const res = await fetchGoals();
  const json = await res.json();

  if (!json) {
    return {
      notFound: true,
    };
  }

  const goals =
    json?.data?.filter(
      ({ goalType, parentGoal }) =>
        goalType === "Company" && parentGoal === null // Only display Company goals at the root level
    ) || [];

  return {
    props: { goals },
  };
}

export default function Home({ goals }) {
  return (
    <div>
      <Logo />
      <div className="pt-20 px-8">
        {!!goals?.length && (
          <ul className="flex flex-wrap -mx-4">
            {goals.map((d) => (
              <li key={d.id} className="w-1/4 px-4 my-4">
                <Link href={`/goals/${d.id}`}>
                  <a className="text-3xl p-4 block h-full border border-gray-600 text-2xl hover:bg-white hover:border-white hover:text-black">
                    {d.name}
                    {d?.owners?.data?.length && (
                      <span className="flex mt-2">
                        <span className="block text-xs ml-auto">
                          — {d.owners.data.map((o) => o.name).join(", ")}
                        </span>
                      </span>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
