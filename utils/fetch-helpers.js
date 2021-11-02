const GOALS_URL = `https://api.latticehq.com/v1/goals?state=Active&expand[]=owners`;

const goalUrl = (id) =>
  `https://api.latticehq.com/v1/goal/${id}?expand[]=childGoals&expand[]=parentGoal&expand=owners`;

const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.LATTICE_TOKEN}`,
  },
};

export const fetchGoals = async () => await fetch(GOALS_URL, options);
export const fetchGoal = async (id) => await fetch(goalUrl(id), options);
