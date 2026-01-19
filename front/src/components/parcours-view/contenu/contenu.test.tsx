import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Contenu from "./contenu";
import { Context } from "../../../store/context.store";
import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";

// -------------------------------------------------------------------------
// MOCKS
// -------------------------------------------------------------------------
vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>(
    "react-redux"
  );
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/test/parcours" }),
}));

const mockSendRequest = vi.fn();
vi.mock("../../../hooks/use-http", () => ({
  default: () => ({
    isLoading: false,
    sendRequest: mockSendRequest,
  }),
}));

vi.mock("../../../utils/userBelongsToContacts", () => ({
  default: vi.fn(() => true),
}));

// Mock Data
const mockModules: Module[] = [
  {
    id: 101,
    title: "Introduction to React",
    minDate: "2023-01-01T00:00:00.000Z",
    thumb: "img1.jpg",
    contacts: [],
    description: "Learn React basics",
    bonusSkills: [],
    duration: 10,
    parcours: {
      title: "",
      formation: {
        title: "",
        level: "",
        code: "",
        tags: [],
      },
      tags: [],
      contacts: [],
      description: "",
      thumb: "",
      modules: [],
      bonusSkills: [],
      skills: [],
      objectives: [],
      groups: [],
      isPublished: true,
      author: "",
      visibility: true,
    },
    courses: [],
    tags: [],
  },
  {
    id: 102,
    title: "Advanced State Management",
    minDate: "2023-02-01T00:00:00.000Z",
    thumb: "img2.jpg",
    contacts: [],
    description: "Advanced state management techniques",
    bonusSkills: [],
    duration: 15,
    parcours: {
      title: "",
      formation: {
        title: "",
        level: "",
        code: "",
        tags: [],
      },
      tags: [],
      contacts: [],
      description: "",
      thumb: "",
      modules: [],
      bonusSkills: [],
      skills: [],
      objectives: [],
      groups: [],
      isPublished: true,
      author: "",
      visibility: true,
    },
    courses: [],
    tags: [],
  },
];

const mockCoursesModule101 = [
  {
    id: 1,
    title: "Hooks Basics",
    lessons: [],
    isPublished: true,
    visibility: true,
  },
];

const mockCoursesModule102 = [
  {
    id: 2,
    title: "Redux Deep Dive",
    lessons: [],
    isPublished: true,
    visibility: true,
  },
];

describe("Contenu Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSelector).mockReturnValue([]);

    mockSendRequest.mockImplementation((config, applyData) => {
      if (config.path.includes("/course/101")) {
        applyData({ response: mockCoursesModule101 });
      } else if (config.path.includes("/course/102")) {
        applyData({ response: mockCoursesModule102 });
      }
    });
  });

  const renderContenu = (modules = mockModules) => {
    const mockUser = { id: 1, roles: ["admin"] };
    return render(
      <Context.Provider
        value={
          { user: mockUser } as unknown as React.ContextType<typeof Context>
        }
      >
        <Contenu modules={modules as typeof mockModules} />
      </Context.Provider>
    );
  };

  it("should render the correct number of modules in the list", () => {
    renderContenu();
    const items = screen.getAllByTestId("contenu-item");
    expect(items).toHaveLength(2);

    // FIX 2: Use getAllByText because the text appears in the List AND the Header
    // We just check that at least one instance exists
    const titles = screen.getAllByText("Introduction to React");
    expect(titles[0]).toBeInTheDocument();
  });

  it("should load the first module's details and courses by default", async () => {
    renderContenu();

    // FIX 2: Handle multiple elements found
    const titles = screen.getAllByText("Introduction to React");
    expect(titles[0]).toBeInTheDocument();

    expect(mockSendRequest).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/course/101" }),
      expect.any(Function)
    );

    await waitFor(() => {
      expect(screen.getByText("Hooks Basics")).toBeInTheDocument();
    });
  });

  it("should update ContenuDetail when a generic ContenuItem is clicked", async () => {
    renderContenu();

    // There are two "Advanced State Management" texts (List + possible header if already loaded)
    // We want to click the one in the sidebar list.
    // Usually, the sidebar item is the first one found in the DOM order, or we can just click the first one.
    const moduleTitles = screen.getAllByText("Advanced State Management");
    fireEvent.click(moduleTitles[0]);

    await waitFor(() => {
      expect(mockSendRequest).toHaveBeenCalledWith(
        expect.objectContaining({ path: "/course/102" }),
        expect.any(Function)
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Redux Deep Dive")).toBeInTheDocument();
      expect(screen.queryByText("Hooks Basics")).not.toBeInTheDocument();
    });
  });

  it("should display 'Aucun modules' when list is empty", () => {
    renderContenu([]);
    expect(screen.getByText("Aucun modules")).toBeInTheDocument();
  });
});
