import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { UrlFormatter } from "./UrlFormatter";

const meta = {
  title: "Components/UrlFormatter",
  component: UrlFormatter,
  decorators: [
    (Story) => (
      <div className="px-4 py-4">
        <Story />
      </div>
    ),
  ],
  args: { onSave: fn() },
} satisfies Meta<typeof UrlFormatter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing typed yet: copy / open buttons are disabled. */
export const Empty: Story = {};

/** A .com URL: the dot is inserted and the buttons are enabled. */
export const DotInserted: Story = {
  args: { initialValue: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
};

/** Short youtu.be links have no .com, so nothing changes and buttons stay disabled. */
export const NoChangeNeeded: Story = {
  args: { initialValue: "https://youtu.be/dQw4w9WgXcQ" },
};

/** Already contains the dot: no further change. */
export const AlreadyFormatted: Story = {
  args: { initialValue: "https://www.youtube.com./watch?v=dQw4w9WgXcQ" },
};

/** Not a URL at all: treated as unchanged text. */
export const InvalidInput: Story = {
  args: { initialValue: "this is not a link" },
};

/** Very long URL: the output should truncate instead of breaking the layout. */
export const LongUrl: Story = {
  args: {
    initialValue:
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLabcdefghijklmnopqrstuvwxyz0123456789&index=12&t=1234s&pp=ygUJcmljayBhc3RsZXk%3D",
  },
};
