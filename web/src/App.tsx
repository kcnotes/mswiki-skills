import { createTheme, Box, Grid, MantineProvider, Stack } from "@mantine/core";
import { VersionSelector } from "./skills/version_selector";
import { Suspense } from "react";
import { Sidebar } from "./skills/sidebar";
import { SkillImportContextProvider } from "./skills/skill_context_provider";

export function App() {
  const theme = createTheme({
    primaryColor: "violet",
    focusRing: "never",
    defaultRadius: "xs",
    activeClassName: '',
  });

  return (
    <MantineProvider theme={theme}>
      <SkillImportContextProvider>
        <Stack gap="md" p="sm" h="100dvh">
          <Box>
            <VersionSelector />
          </Box>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Suspense fallback={<div>Loading...</div>}>
                <Sidebar />
              </Suspense>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 9 }}><pre>{ }</pre></Grid.Col>
          </Grid>
        </Stack>
      </SkillImportContextProvider>    </MantineProvider>
  );
}
