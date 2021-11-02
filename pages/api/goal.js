import { fetchGoal } from "../../utils/fetch-helpers";

async function handler(req, res) {
  const response = await fetchGoal(req.query.id);

  res.json(response.body);
}

export default handler;
