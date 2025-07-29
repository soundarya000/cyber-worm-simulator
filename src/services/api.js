export async function fetchTree() {
  const response = await fetch("/api/tree");
  return response.json();
}
