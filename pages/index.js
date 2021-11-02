export async function getServerSideProps() {
  const res = await fetch(
    `https://api.latticehq.com/v1/goals?state=Active&expand[]=owners`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.LATTICE_TOKEN}`,
      },
    }
  );
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
          <li key={d.id}>{d.name}</li>
        ))}
      </ul>
    )
  );
}
