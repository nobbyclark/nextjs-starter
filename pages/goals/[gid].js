import Link from "next/link";

import { fetchGoal } from "../../utils/fetch-helpers";

export async function getServerSideProps({ params }) {
  const res = await fetchGoal(params.gid);
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

export default function Goal({ json }) {
  return <h1>{json?.name}</h1>;
}
