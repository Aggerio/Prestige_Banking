import { Button, Grid, IconButton, InputAdornment, Link, TextField } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useBreakpoints } from 'providers/useBreakpoints';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { up } = useBreakpoints();
  const upSM = up('sm');
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!customerId || !password) return;
    setSubmitting(true);
    try {
      await login(Number(customerId), password);
      navigate('/dashboard');
    } catch {
      /* provider supplies message */
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} sx={{ mb: 2.5 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={upSM ? 'medium' : 'small'}
            name="customerId"
            label="Customer ID"
            type="number"
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={upSM ? 'medium' : 'small'}
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <IconifyIcon icon={showPassword ? 'majesticons:eye' : 'majesticons:eye-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      {error && (
        <Grid container sx={{ mt: 2 }}>
          <Grid item>
            <Link color="error.main">{error}</Link>
          </Grid>
        </Grid>
      )}
      <Button
        fullWidth
        size={upSM ? 'large' : 'medium'}
        type="submit"
        variant="contained"
        color="primary"
        disabled={submitting}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
