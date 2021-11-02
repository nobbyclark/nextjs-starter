import Link from "next/link";

import { fetchGoals } from "../utils/fetch-helpers";

export async function getServerSideProps() {
  const res = await fetchGoals();
  const json = await res.json();

  if (!json) {
    return {
      notFound: true,
    };
  }

  return {
    props: { json },
  };
}

export default function Home({ json }) {
  return (
    !!json?.data?.length && (
      <ul>
        {json.data.map((d) => (
          <li key={d.id}>
            <Link href={`/goals/${d.id}`}>
              <a>{d.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    )
  );
}
