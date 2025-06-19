import type { Meta, StoryObj } from '@storybook/react';
import { Hello2 } from '../src';

const meta: Meta<typeof Hello2> = {
  title: 'ui-lib-2/Hello2',
  component: Hello2,
};
export default meta;

type Story = StoryObj<typeof Hello2>;

export const Default: Story = {};
