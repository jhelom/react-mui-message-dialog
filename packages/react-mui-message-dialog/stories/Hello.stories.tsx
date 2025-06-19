import type {Meta, StoryObj} from '@storybook/react';
import {Hello1} from '../src';

const meta: Meta<typeof Hello> = {
    title: 'ui-lib-1/Hello',
    component: Hello,
};
export default meta;

type Story = StoryObj<typeof Hello>;

export const Default: Story = {};
