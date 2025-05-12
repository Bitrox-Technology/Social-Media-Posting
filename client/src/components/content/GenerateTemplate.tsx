import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useGenerateCodeMutation } from '../../store/api';

// Validation schema with Yup
const validationSchema = Yup.object({
  image: Yup.mixed()
    .required('Image is required')
    .test('fileType', 'Only JPG/PNG images are allowed', (value) =>
      value instanceof File ? ['image/jpeg', 'image/png'].includes(value.type) : false
    )
    .test('fileSize', 'Image size must be less than 5MB', (value) =>
      value instanceof File ? value.size <= 5 * 1024 * 1024 : false
    ),
  code: Yup.string()
    .required('Code is required')
    .min(10, 'Code must be at least 10 characters'),
});

const CodeGeneratorForm: React.FC = () => {
  const [generateCode, { isLoading, error }] = useGenerateCodeMutation();
  const [responseData, setResponseData] = useState<any>(null);

  const formik = useFormik({
    initialValues: {
      image: null as File | null,
      code: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.image) {
        // Create FormData object
        const formData = new FormData();
        formData.append('image', values.image);
        formData.append('code', values.code);

        try {
          const response = await generateCode(formData).unwrap();
          // Ensure response has the expected shape
          setResponseData(response.data);
        } catch (err) {
          console.error('API error:', err);
        }
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Code Generator
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        {/* Image Upload */}
        <Box mb={2}>
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  formik.setFieldValue('image', file);
                }
              }}
            />
          </Button>
          {formik.touched.image && formik.errors.image && (
            <Typography color="error">{formik.errors.image}</Typography>
          )}
          {formik.values.image && (
            <Typography variant="body2">{formik.values.image.name}</Typography>
          )}
        </Box>

        {/* Code Input */}
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Enter Code"
          name="code"
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
          sx={{ mb: 2 }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading || !formik.isValid}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Generate Code'}
        </Button>
      </form>

      {/* API Response */}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {JSON.stringify(error)}
        </Typography>
      )}
      {responseData && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Image Description:</Typography>
          <Typography>{responseData.imageDescription}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generated Code Template:
          </Typography>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {responseData}
          </pre>
        </Box>
      )}
    </Box>
  );
};

export default CodeGeneratorForm;