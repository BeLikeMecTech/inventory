const API = "http://localhost:5000";

export const getItems = async () =>
  (await fetch(API + "/items")).json();

export const addItem = async (data) =>
  (await fetch(API + "/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })).json();

export const deleteItem = async (id) =>
  fetch(API + "/items/" + id, { method: "DELETE" });