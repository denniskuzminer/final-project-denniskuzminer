import { FormLabel, TextField } from "@mui/material";
import { Field, Form, Formik, FormikProps } from "formik";
import { formFields } from "./constants";
import { BacktestFormData } from "./models";

interface BacktestFormProps {
  strategy: BacktestFormData;
}

export default function BacktestForm(props: BacktestFormProps) {
  const { strategy } = props;

  return (
    <Formik initialValues={{} as BacktestFormData} onSubmit={() => {}}>
      {(props: FormikProps<any>) => (
        <Form>
          {formFields.map(({ id, label, text }, i) => (
            <Field key={i} name={id}>
              {({ field }) => (
                <div>
                  <FormLabel htmlFor={id}>{text}:</FormLabel>
                  <br />
                  <TextField
                    id={id}
                    label={label}
                    defaultValue={strategy[id]}
                    variant="outlined"
                    {...field}
                  />
                </div>
              )}
            </Field>
          ))}
        </Form>
      )}
    </Formik>
  );
}
