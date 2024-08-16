import Button from './Button';

export default {
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: 'Variant styles of Button component',
    },
    onClick: {
      description: 'Optional click event handler',
    },
  },
};

export const Primary = {
  args: {
    type: 'primary',
    children: 'Primary',
  },
};
