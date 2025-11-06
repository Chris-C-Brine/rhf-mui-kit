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
import { AutocompleteElementDisplay, ObjectElementDisplay, TextElementDisplay, ValidationElement } from "./src";

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

// Component to demonstrate AutocompleteElementDisplay
const AutocompleteDemo = () => {
  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          AutocompleteElementDisplay
        </Typography>
        <Typography variant="body2" color="text.secondary">
          An enhanced Autocomplete component with view-only mode support.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Standard Mode
            </Typography>
            <AutocompleteElementDisplay
              name="Autocomplete Standard Mode"
              label="Select a skill"
              options={skills}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Standard Mode (View-Only)
            </Typography>
            <AutocompleteElementDisplay
              name="Autocomplete Standard Mode"
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
            <AutocompleteElementDisplay
              name="Autocomplete Multiple Selection"
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
            <AutocompleteElementDisplay
              name="Autocomplete Multiple Selection"
              label="Select multiple skills"
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

// Component to demonstrate ObjectElementDisplay
const ObjectDisplayDemo = () => {
  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ObjectElementDisplay
        </Typography>
        <Typography variant="body2" color="text.secondary">
          An Autocomplete component that works with complex object values.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Single Object Selection
            </Typography>
            <ObjectElementDisplay
              name="Single Object Selection"
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
            <ObjectElementDisplay
              name="Single Object Selection"
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
              Multiple Object Selection with Checkboxes
            </Typography>
            <ObjectElementDisplay
              name="Multiple Object Selection with Checkboxes"
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
              Multiple Object Selection with Checkboxes  (View-Only)
            </Typography>
            <ObjectElementDisplay
              name="Multiple Object Selection with Checkboxes"
              label="Select multiple countries"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              multiple
              showCheckbox
              viewOnly
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Object Free Solo Mode
            </Typography>
            <ObjectElementDisplay
              name="Object Free Solo Mode"
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
              Object Free Solo Mode (View-Only)
            </Typography>
            <ObjectElementDisplay
              name="Object Free Solo Mode"
              label="Enter a country (free solo)"
              options={countries}
              getItemKey={(country) => (typeof country === "string" ? country : country?.id || "")}
              getItemLabel={(country) =>
                typeof country === "string" ? country : country?.name || ""
              }
              freeSolo
              stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
              viewOnly
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Custom Chip Props
            </Typography>
            <ObjectElementDisplay
              name="Custom Chip Props"
              label="Select countries with custom chips"
              options={countries}
              freeSolo
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              stringToNewItem={(value) => ({ id: `new-${value}`, name: value })}
              getChipProps={({ index }) => ({
                color: index % 2 === 0 ? "primary" : "secondary",
                variant: "outlined",
              })}
              multiple
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Custom Chip Props (View-Only)
            </Typography>
            <ObjectElementDisplay
              name="Custom Chip Props"
              label="Select countries with custom chips"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              getChipProps={({ index }) => ({
                color: index % 2 === 0 ? "primary" : "secondary",
                variant: "outlined",
              })}
              multiple
              viewOnly
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Transform Value Example
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This example transforms the selected value by adding a timestamp.
            </Typography>
            <ObjectElementDisplay
              name="Transform Value Example"
              label="Select a country"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              transformValue={(value) => ({
                ...value,
                selectedAt: new Date().toISOString(),
              })}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Transform Value Example (View-Only)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View-only mode of the transform value example.
            </Typography>
            <ObjectElementDisplay
              name="Transform Value Example"
              label="Selected country with timestamp"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              transformValue={(value) => ({
                ...value,
                selectedAt: new Date().toISOString(),
              })}
              viewOnly
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Transform Multiple Values
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This example transforms multiple selected values by adding a priority field.
            </Typography>
            <ObjectElementDisplay
              name="Transform Multiple Values"
              label="Select multiple countries"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              multiple
              transformValue={(values) => 
                Array.isArray(values) 
                  ? values.map((value, index) => ({
                      ...value,
                      priority: index + 1,
                    }))
                  : values
              }
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Transform Multiple Values (View-Only)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View-only mode of the multiple values transform example.
            </Typography>
            <ObjectElementDisplay
              name="Transform Multiple Values"
              label="Selected countries with priority"
              options={countries}
              getItemKey={(country) => country?.id || ""}
              getItemLabel={(country) => country?.name || ""}
              multiple
              transformValue={(values) => 
                Array.isArray(values) 
                  ? values.map((value, index) => ({
                      ...value,
                      priority: index + 1,
                    }))
                  : values
              }
              viewOnly
              required
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Component to demonstrate TextElementDisplay
const TextElementDisplayDemo = () => {
  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          TextElementDisplay
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A text field component with view-only capabilities.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Standard Mode
            </Typography>
            <TextElementDisplay
              name="Text Standard Mode"
              label="Text Input"
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Standard Mode (View-Only)
            </Typography>
            <TextElementDisplay
              name="Text Standard Mode"
              label="View-Only Text"
              viewOnly
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              With Helper Text
            </Typography>
            <TextElementDisplay
              name="Text With Helper Text"
              label="Text with Helper"
              helperText="This is a helper text"
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              With Helper Text (View-Only) Without Underline
            </Typography>
            <TextElementDisplay
              name="Text With Helper Text"
              label="Text with Helper"
              helperText="This is a helper text"
              viewOnly
              disableUnderline
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              With Placeholder
            </Typography>
            <TextElementDisplay
              name="Text With Placeholder"
              label="With Placeholder"
              placeholder="Enter text here"
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              With Placeholder (View-Only)
            </Typography>
            <TextElementDisplay
              name="Text With Placeholder"
              label="With Placeholder"
              placeholder="Enter text here"
              viewOnly
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Multiline Text Field
            </Typography>
            <TextElementDisplay
              name="Multiline Text Field"
              label="Multiline Text"
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Multiline Text Field (View-Only)
            </Typography>
            <TextElementDisplay
              name="Multiline Text Field"
              label="Multiline Text"
              multiline
              rows={4}
              viewOnly
              required
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Component to demonstrate ValidationElement
const ValidationElementDemo = () => {
  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ValidationElement
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

        <ValidationElement name="Nested.HiddenField" rules={{ required: "This field is required" }} />
      </CardContent>
    </Card>
  );
};

// Main App component
const App = () => {
  const methods = useForm({
    defaultValues: {
      "Autocomplete Standard Mode": "React",
      "Autocomplete Multiple Selection": ["JavaScript", "TypeScript"],
      "Single Object Selection": countries[0],
      "Multiple Object Selection with Checkboxes": [countries[0], countries[1]],
      "Object Free Solo Mode": { id: "SO", name: "Some One" },
      "Custom Chip Props": [countries[5], countries[6], { id: "SO", name: "Some One" }],
      "Transform Value Example": { ...countries[2], selectedAt: new Date().toISOString() },
      "Transform Multiple Values": [
        { ...countries[3], priority: 1 },
        { ...countries[4], priority: 2 },
        { ...countries[7], priority: 3 },
      ],
      "Text Standard Mode": "",
      "Text With Helper Text": "Text with helper",
      "Text With Placeholder": "",
      "Multiline Text Field": "This is a multiline\ntext field example\nwith multiple lines",
      Nested: {
        HiddenField: "",
      }
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
            onSubmit={methods.handleSubmit(
              (data) => console.log("Form data:", data),
              (errors, event) => {
                console.error("Form errors:", errors);
                event?.target && console.log(methods.getValues());
              },
            )}
          >
            <AutocompleteDemo />
            <ObjectDisplayDemo />
            <TextElementDisplayDemo />
            <ValidationElementDemo />
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
