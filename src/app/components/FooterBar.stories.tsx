import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FooterBar } from "./FooterBar";

const meta = {
  title: "Components/FooterBar",
  component: FooterBar,
  decorators: [
    (Story) => (
      <div className="flex-1 flex flex-col justify-end px-4 py-3">
        <Story />
      </div>
    ),
  ],
  args: { autoApply: true, onAutoApplyToggle: fn() },
} satisfies Meta<typeof FooterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AutoApplyOn: Story = {};

export const AutoApplyOff: Story = { args: { autoApply: false } };

/** Clicking "Feedback" opens the modal (the real send function is never called here). */
export const OpensFeedback: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Feedback" }));
    await expect(within(canvasElement).getByPlaceholderText("Tell us what you think…")).toBeInTheDocument();
  },
};
