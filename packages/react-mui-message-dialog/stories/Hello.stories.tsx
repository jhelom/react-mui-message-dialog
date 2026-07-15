import type {Meta, StoryObj} from '@storybook/react';
import {DialogTitleEx} from '../src';

const meta = {
    title: 'components/DialogTitleEx',
    component: DialogTitleEx,
    args: {
        title: 'Sample dialog title',
    },
} satisfies Meta<typeof DialogTitleEx>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closable: Story = {
    args: {
        title: 'Closable dialog title',
        onClose: () => undefined,
    },
};

