import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";

jest.mock("./api/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ element }) => element,
  Outlet: () => null,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/" }),
}));

test("renders goal tracker dashboard", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByText(/Your Goals/i)).toBeInTheDocument();
  expect(screen.getByText(/New Goal/i)).toBeInTheDocument();
  expect(await screen.findByText(/Start Your Journey/i)).toBeInTheDocument();
});
