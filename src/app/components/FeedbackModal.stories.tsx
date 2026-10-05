import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FeedbackModal } from "./FooterBar";

// Fake backends: no network and no localStorage in any story.
const sendOk = () => new Promise<void>((resolve) => setTimeout(resolve, 300));
const sendNever = () => new Promise<void>(() => {});
const sendFail = () => Promise.reject(new Error("network down"));

const meta = {
  title: "Components/FeedbackModal",
  component: FeedbackModal,
  args: { onClose: fn(), send: sendOk },
} satisfies Meta<typeof FeedbackModal>;

export default meta;
type Story = StoryObj<typeof meta>;

async function typeAndSend(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByPlaceholderText("Tell us what you think…"), "Great tool!");
  await userEvent.click(canvas.getByRole("button", { name: /send/i }));
  return canvas;
}

/** Empty textarea: Send is disabled. */
export const Empty: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: /send/i })).toBeDisabled();
  },
};

/** Request in flight: Send stays disabled until it settles. */
export const Sending: Story = {
  args: { send: sendNever },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSend(canvasElement);
    await expect(canvas.getByRole("button", { name: /send/i })).toBeDisabled();
  },
};

/** Send failed: error text appears and the typed message is kept. */
export const SendFailed: Story = {
  args: { send: sendFail },
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSend(canvasElement);
    await expect(await canvas.findByText(/Couldn't send/)).toBeInTheDocument();
    await expect(canvas.getByPlaceholderText("Tell us what you think…")).toHaveValue("Great tool!");
  },
};

/** Send succeeded: shows the success screen. */
export const Success: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await typeAndSend(canvasElement);
    // Waits out the form exit / success enter animation.
    await expect(await canvas.findByText(/Sent successfully/, {}, { timeout: 4000 })).toBeInTheDocument();
  },
};
