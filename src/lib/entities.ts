export type EntityKey =
  | "student"
  | "faculty"
  | "journal"
  | "books"
  | "chapter"
  | "conference_paper"
  | "grants"
  | "ipr";

export type FieldType = "text" | "number";

export type EntityField = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
};

export type EntityRecord = {
  id: string;
  [key: string]: string;
};

export type EntityConfig = {
  key: EntityKey;
  label: string;
  fields: EntityField[];
};

export const ENTITY_CONFIGS: Record<EntityKey, EntityConfig> = {
  student: {
    key: "student",
    label: "Students",
    fields: [
      { key: "name", label: "Name", type: "text", placeholder: "Student name" },
      { key: "program", label: "Program", type: "text", placeholder: "B.Tech / M.Tech / PhD" },
      { key: "year", label: "Year", type: "number", placeholder: "2026" },
      { key: "rollNo", label: "Roll No", type: "text", placeholder: "Roll number" },
    ],
  },
  faculty: {
    key: "faculty",
    label: "Faculty",
    fields: [
      { key: "name", label: "Name", type: "text", placeholder: "Faculty name" },
      { key: "department", label: "Department", type: "text", placeholder: "CSE / ECE / ..." },
      { key: "designation", label: "Designation", type: "text", placeholder: "Professor" },
      { key: "email", label: "Email", type: "text", placeholder: "name@domain.com" },
    ],
  },
  journal: {
    key: "journal",
    label: "Journals",
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "Journal paper title" },
      { key: "journalName", label: "Journal", type: "text", placeholder: "Journal name" },
      { key: "year", label: "Year", type: "number", placeholder: "2026" },
      { key: "status", label: "Status", type: "text", placeholder: "Published / Accepted" },
    ],
  },
  books: {
    key: "books",
    label: "Books",
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "Book title" },
      { key: "publisher", label: "Publisher", type: "text", placeholder: "Publisher" },
      { key: "year", label: "Year", type: "number", placeholder: "2026" },
      { key: "isbn", label: "ISBN", type: "text", placeholder: "ISBN" },
    ],
  },
  chapter: {
    key: "chapter",
    label: "Chapters",
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "Chapter title" },
      { key: "bookTitle", label: "Book Title", type: "text", placeholder: "Book title" },
      { key: "year", label: "Year", type: "number", placeholder: "2026" },
      { key: "publisher", label: "Publisher", type: "text", placeholder: "Publisher" },
    ],
  },
  conference_paper: {
    key: "conference_paper",
    label: "Conference Papers",
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "Paper title" },
      { key: "conference", label: "Conference", type: "text", placeholder: "Conference name" },
      { key: "year", label: "Year", type: "number", placeholder: "2026" },
      { key: "location", label: "Location", type: "text", placeholder: "City, Country" },
    ],
  },
  grants: {
    key: "grants",
    label: "Grants",
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "Grant title" },
      { key: "agency", label: "Agency", type: "text", placeholder: "Funding agency" },
      { key: "amount", label: "Amount", type: "number", placeholder: "500000" },
      { key: "year", label: "Year", type: "number", placeholder: "2026" },
    ],
  },
  ipr: {
    key: "ipr",
    label: "IPR",
    fields: [
      { key: "title", label: "Title", type: "text", placeholder: "IPR title" },
      { key: "type", label: "Type", type: "text", placeholder: "Patent / Copyright" },
      { key: "status", label: "Status", type: "text", placeholder: "Filed / Granted" },
      { key: "year", label: "Year", type: "number", placeholder: "2026" },
    ],
  },
};

export function getEntityConfig(entity: string): EntityConfig | null {
  const raw = (() => {
    try {
      return decodeURIComponent(entity);
    } catch {
      return entity;
    }
  })();

  const normalized = raw.trim().toLowerCase();
  const aliased = (() => {
    const map: Record<string, EntityKey> = {
      students: "student",
      student: "student",
      faculties: "faculty",
      faculty: "faculty",
      journals: "journal",
      journal: "journal",
      book: "books",
      books: "books",
      chapters: "chapter",
      chapter: "chapter",
      "conference-paper": "conference_paper",
      "conference-papers": "conference_paper",
      conferencepaper: "conference_paper",
      conferencepapers: "conference_paper",
      conference_paper: "conference_paper",
      conference_papers: "conference_paper",
      grants: "grants",
      grant: "grants",
      ipr: "ipr",
    };
    return map[normalized] ?? normalized;
  })();

  return (ENTITY_CONFIGS as Record<string, EntityConfig | undefined>)[aliased] ?? null;
}

export type EntitiesState = Record<EntityKey, EntityRecord[]>;

export const INITIAL_ENTITIES_STATE: EntitiesState = {
  student: [
    { id: "s1", name: "Asha Verma", program: "B.Tech", year: "2026", rollNo: "CSE-001" },
  ],
  faculty: [
    {
      id: "f1",
      name: "Dr. R. Sharma",
      department: "CSE",
      designation: "Professor",
      email: "r.sharma@example.com",
    },
  ],
  journal: [
    {
      id: "j1",
      title: "AI for RMS",
      journalName: "International Journal of Systems",
      year: "2025",
      status: "Published",
    },
  ],
  books: [
    { id: "b1", title: "Research Methods", publisher: "Academic Press", year: "2024", isbn: "123-456" },
  ],
  chapter: [
    {
      id: "c1",
      title: "Chapter on Data",
      bookTitle: "Handbook of Data",
      year: "2024",
      publisher: "Springer",
    },
  ],
  conference_paper: [
    {
      id: "cp1",
      title: "Next.js Dashboards",
      conference: "ICSE",
      year: "2026",
      location: "Bengaluru",
    },
  ],
  grants: [
    { id: "g1", title: "Lab Modernization", agency: "DST", amount: "2000000", year: "2026" },
  ],
  ipr: [
    { id: "i1", title: "Smart RMS", type: "Patent", status: "Filed", year: "2026" },
  ],
};
