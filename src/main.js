import renderFilter from "./filter";
import renderEvent from "./event";
import renderRandomCards from "./render-random-cards";

renderFilter(`Everything`, `filter-everything`, true);
renderFilter(`Future`, `filter-filter-future`);
renderFilter(`Past`, `filter-past`);

let countEvent = 0;
while (countEvent < 7) {
  countEvent++;
  renderEvent(`Taxi`, `Taxi to Airport`, [`Order UBER +€ 20`, `Upgrade to business +€ 20`])
}

renderRandomCards();
