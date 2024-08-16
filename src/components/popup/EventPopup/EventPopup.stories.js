import EventPopup from './EventPopup';

export default {
  component: EventPopup,
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
      description: `string`,
    },
    popupId: {
      description: 'Unique values in the popup',
      typeof: 'string',
    },
    image: {
      description: 'Image Link',
    },
    alt: {
      description: 'Popup image alternative text',
    },
    title: {
      description: 'title text',
    },
    description: {
      description: 'description text',
    },
    onClick: {
      description: 'Confirm button action',
    },
  },
};

export const Image = {
  args: {
    popupId: 'examplePopup',
    image:
      'https://images.unsplash.com/photo-1701293773241-de1a7bff8e3d?q=80&w=3718&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'popup image',
    type: 'sm',
    title: 'Artiside New Popup',
    description: '10 ADF for your feedback!',
    onClick: () => {},
  },
};

export const NoImage = {
  args: {
    popupId: 'noImagePopup',
    type: 'sm',
    title: 'Write a Title',
    description: 'You can join ay any time.',
    onClick: () => {},
  },
};
