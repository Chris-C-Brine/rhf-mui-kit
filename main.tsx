import React from "react";
import ReactDOM from "react-dom/client";
import { FormProvider, useForm } from "react-hook-form";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  Grid,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import { AutocompleteDisplayElement, ObjectDisplayElement, HiddenElement } from "./src";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Sample data for demonstrations
const countries = [
  { id: "US", name: "United States" },
  { id: "CA", name: "Canada" },
  { id: "UK", name: "United Kingdom" },
  { id: "AU", name: "Australia" },
  { id: "GE", name: "Germany" },
  { id: "FR", name: "France" },
  { id: "JP", name: "Japan" },
  { id: "BR", name: "Brazil" },
  { id: "IN", name: "India" },
];

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "PHP",
];

// Component to demonstrate AutocompleteDisplayElement
const AutocompleteDemo = () => {
  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          AutocompleteDisplayElement
        </Typography>
        <Typography variant="body2" color="text.secondary">
          An enhanced Autocomplete component with view-only mode support.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Standard Mode
            </Typography>
            <AutocompleteDisplayElement
              name="skill"
              label="Select a skill"
              options={skills}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              View-Only Mode
            </Typography>
            <AutocompleteDisplayElement
              name="viewOnlySkill"
              label="Selected skill"
              options={skills}
              viewOnly
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Multiple Selection
            </Typography>
            <AutocompleteDisplayElement
              name="multipleSkills"
              label="Select multiple skills"
              options={skills}
              multiple
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Multiple Selection (View-Only)
            </Typography>
            <AutocompleteDisplayElement
              name="viewOnlyMultipleSkills"
              label="Selected skills"
              options={skills}
              multiple
              viewOnly
              required
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Component to demonstrate ObjectDisplayElement
const ObjectDisplayDemo = () => {
  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ObjectDisplayElement
        </Typography>
        <Typography variant="body2" color="text.secondary">
          An Autocomplete component that works with complex object values.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Single Object Selection
            </Typography>
            <ObjectDisplayElement
              name="country"
              label="Select a country"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Single Object Selection (View-Only)
            </Typography>
            <ObjectDisplayElement
              name="viewOnlyCountry"
              label="Selected country"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              viewOnly
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Multiple Object Selection
            </Typography>
            <ObjectDisplayElement
              name="multipleCountries"
              label="Select multiple countries"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              multiple
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Multiple Object Selection with Checkboxes
            </Typography>
            <ObjectDisplayElement
              name="multipleCountriesWithCheckboxes"
              label="Select multiple countries"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              multiple
              showCheckbox
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Free Solo Mode
            </Typography>
            <ObjectDisplayElement
              name="freeSoloCountry"
              label="Enter a country (free solo)"
              options={countries}
              getItemKey={(country) => (typeof country === "string" ? country : country?.id || "")}
              getItemLabel={(country) =>
                typeof country === "string" ? country : country?.name || ""
              }
              freeSolo
              stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Custom Chip Props
            </Typography>
            <ObjectDisplayElement
              name="customChipCountries"
              label="Select countries with custom chips"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              getChipProps={({ index }) => ({
                color: index % 2 === 0 ? "primary" : "secondary",
                variant: "outlined",
              })}
              multiple
              required
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Component to demonstrate HiddenElement
const HiddenElementDemo = () => {
  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          HiddenElement
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A hidden input field with React Hook Form integration.
        </Typography>

        <Box mt={2}>
          <Typography variant="body2">
            This component renders a hidden input field that is included in form submission. It
            supports validation rules and error display.
          </Typography>
        </Box>

        <HiddenElement name="hiddenField" rules={{ required: "This field is required" }} />
      </CardContent>
    </Card>
  );
};

// Main App component
const App = () => {
  const methods = useForm({
    defaultValues: {
      skill: "React",
      viewOnlySkill: "TypeScript",
      multipleSkills: ["JavaScript", "TypeScript"],
      viewOnlyMultipleSkills: ["React", "Node.js"],
      country: countries[0],
      viewOnlyCountry: countries[1],
      multipleCountries: [countries[0], countries[1]],
      multipleCountriesWithCheckboxes: [countries[2], countries[3]],
      freeSoloCountry: countries[4],
      customChipCountries: [countries[5], countries[6]],
      hiddenField: "",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RHF-MUI-KIT Component Showcase
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Material UI React Hook Form Components
          </Typography>
          <Typography variant="body1">
            This showcase demonstrates the components available in the RHF-MUI-KIT library. Each
            component is integrated with React Hook Form and Material UI.
          </Typography>
          <Divider />
        </Box>

        <FormProvider {...methods}>
          <form
            noValidate={true}
            onSubmit={methods.handleSubmit((data) => console.log("Form data:", data))}
          >
            <AutocompleteDemo />
            <ObjectDisplayDemo />
            <HiddenElementDemo />
            <Box textAlign={"center"}>
              <Button variant={"outlined"} onClick={() => methods.reset()} sx={{ mr: 3 }}>
                reset
              </Button>
              <Button variant={"contained"} type={"submit"} color={"primary"}>
                Submit
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Container>
    </ThemeProvider>
  );
};

// Render the app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
