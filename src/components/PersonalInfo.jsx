import { TextField, Box } from "@mui/material";

import PropTypes from "prop-types";

const PersonalInfo = ({ form }) => {
    PersonalInfo.propTypes = {
        form: PropTypes.object.isRequired,
    };
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <Box>
            <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                margin="normal"
                {...register("firstName")}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
            />
            <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                margin="normal"
                {...register("lastName")}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
            />
            <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                margin="normal"
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
            />
        </Box>
    );
};

export default PersonalInfo;
