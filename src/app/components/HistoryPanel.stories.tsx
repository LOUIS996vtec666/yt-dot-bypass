import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { HistoryPanel, type HistoryItem } from "./HistoryPanel";

// Fake data only: nothing here reads or writes localStorage.
const ago = (ms: number) => new Date(Date.now() - ms);
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const fakeItems: HistoryItem[] = [
  {
    id: "1",
    original: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    formatted: "https://www.youtube.com./watch?v=dQw4w9WgXcQ",
    timestamp: ago(20 * 1000),
  },
  {
    id: "2",
    original: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    formatted: "https://www.youtube.com./watch?v=9bZkp7q19f0",
    timestamp: ago(12 * MIN),
  },
  {
    id: "3",
    original: "https://www.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI",
    formatted: "https://www.youtube.com./playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI",
    timestamp: ago(3 * HOUR),
  },
  {
    id: "4",
    original: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    formatted: "https://www.youtube.com./watch?v=kJQP7kiw5Fk",
    timestamp: ago(2 * DAY),
  },
];

const manyItems: HistoryItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `many-${i}`,
  original: `https://www.youtube.com/watch?v=video${i}`,
  formatted: `https://www.youtube.com./watch?v=video${i}`,
  timestamp: ago((i + 1) * 7 * MIN),
}));

const meta = {
  title: "Components/HistoryPanel",
  component: HistoryPanel,
  args: { items: fakeItems, onClear: fn(), onClose: fn() },
} satisfies Meta<typeof HistoryPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithItems: Story = {};

/** No history yet: shows the empty state, and the clear button is hidden. */
export const Empty: Story = { args: { items: [] } };

export const SingleItem: Story = { args: { items: fakeItems.slice(0, 1) } };

/** The app keeps at most 50 entries: the list must scroll. */
export const FullHistory: Story = { args: { items: manyItems } };

/** An overly long original URL should truncate, not overflow. */
export const LongUrls: Story = {
  args: {
    items: [
      {
        id: "long",
        original:
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLabcdefghijklmnopqrstuvwxyz0123456789&index=12&t=1234s",
        formatted:
          "https://www.youtube.com./watch?v=dQw4w9WgXcQ&list=PLabcdefghijklmnopqrstuvwxyz0123456789&index=12&t=1234s",
        timestamp: ago(5 * MIN),
      },
    ],
  },
};
