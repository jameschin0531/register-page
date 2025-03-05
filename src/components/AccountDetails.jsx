import {
    TextField,
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    Select,
    MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import formConfig from "../config/formConfig.json";

const FormField = ({ field, form }) => {
    const { register, formState: { errors } = {} } = form;
    const fieldConfig = formConfig.fields[field];

    if (field === "contact") {
        return (
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={4}>
                    <Box
                        component="label"
                        htmlFor={field}
                        sx={{ fontWeight: 500 }}
                    >
                        {fieldConfig.label}
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Select
                                fullWidth
                                id="telcode"
                                name="telcode"
                                variant="outlined"
                                defaultValue="+60"
                                {...register("telcode")}
                            >
                                {Object.entries(formConfig.regions).map(([code, region]) =>
                                    Object.keys(region).filter(key => key !== 'name').map(currency =>
                                        region[currency].map(telcode => (
                                            <MenuItem key={`${code}-${telcode}`} value={telcode}>
                                                {telcode}
                                            </MenuItem>
                                        ))
                                    )
                                ).flat(2)}
                            </Select>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                id={field}
                                name={field}
                                type={fieldConfig.type}
                                variant="outlined"
                                placeholder={fieldConfig.placeholder}
                                {...register(field)}
                                error={Boolean(errors[field])}
                                helperText={errors[field]?.message}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    if (fieldConfig.type === "select") {
        return (
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={4}>
                    <Box
                        component="label"
                        htmlFor={field}
                        sx={{ fontWeight: 500 }}
                    >
                        {fieldConfig.label}
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Select
                        fullWidth
                        id={field}
                        name={field}
                        variant="outlined"
                        placeholder={fieldConfig.placeholder}
                        {...register(field)}
                        error={Boolean(errors[field])}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            {fieldConfig.placeholder}
                        </MenuItem>
                        {Object.entries(formConfig.regions).map(([code, region]) =>
                            Object.keys(region).filter(key => key !== 'name').map(currency => (
                                <MenuItem key={`${code}-${currency}`} value={currency}>
                                    {currency}
                                </MenuItem>
                            ))
                        ).flat()}
                    </Select>
                    {errors[field] && (
                        <Box
                            sx={{
                                color: "error.main",
                                mt: 0.5,
                                fontSize: "0.75rem",
                            }}
                        >
                            {errors[field].message}
                        </Box>
                    )}
                </Grid>
            </Grid>
        );
    }

    if (fieldConfig.type === "checkbox") {
        return (
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                id={field}
                                name={field}
                                {...register(field)}
                            />
                        }
                        label={fieldConfig.label}
                        error={Boolean(errors[field])}
                        helperText={errors[field]?.message}
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={4}>
                <Box component="label" htmlFor={field} sx={{ fontWeight: 500 }}>
                    {fieldConfig.label}
                </Box>
            </Grid>
            <Grid item xs={8}>
                <TextField
                    fullWidth
                    id={field}
                    name={field}
                    type={fieldConfig.type}
                    variant="outlined"
                    placeholder={fieldConfig.placeholder}
                    {...register(field)}
                    error={Boolean(errors[field])}
                    helperText={errors[field]?.message}
                />
            </Grid>
        </Grid>
    );
};

FormField.propTypes = {
    field: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
};

const AccountDetails = ({ form, stepFields }) => {
    AccountDetails.propTypes = {
        form: PropTypes.object.isRequired,
        stepFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    };

    return (
        <Box>
            {stepFields.map((field) => (
                <FormField key={field} field={field} form={form} />
            ))}
        </Box>
    );
};

export default AccountDetails;
