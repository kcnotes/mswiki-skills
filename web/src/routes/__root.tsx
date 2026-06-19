import { createRootRoute, Outlet } from '@tanstack/react-router';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'violet',
  focusRing: 'never',
  defaultRadius: 'xs',
  activeClassName: '',
});

export const Route = createRootRoute({
  component: () => (
    <MantineProvider theme={theme}>
      <Outlet />
    </MantineProvider>
  ),
});
