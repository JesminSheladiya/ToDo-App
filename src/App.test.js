import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./api/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
  },
}));

test("renders goal tracker dashboard", async () => {
  render(<App />);

  expect(screen.getByText(/Your Goals/i)).toBeInTheDocument();
  expect(screen.getByText(/New Goal/i)).toBeInTheDocument();
  expect(await screen.findByText(/Start Your Journey/i)).toBeInTheDocument();
});
