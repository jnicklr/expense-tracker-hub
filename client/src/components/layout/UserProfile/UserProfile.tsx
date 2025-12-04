import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import type { User } from "../../../types/user";
import { useEffect, useState } from "react";
import { updateProfileInfo } from "../../../services/userService";
import { useAuth } from "../../../hooks/useAuth";


interface UserProfileProps {
    openProfileModal: boolean;
    setOpenProfileModal: (value: boolean) => void;
    user: User | null;
}

export default function UserProfile({
    openProfileModal,
    setOpenProfileModal,
    user,
}: UserProfileProps) {
    const { setUser } = useAuth();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setEmail(user.email ?? "");
        }
        setNewPassword("");
        setConfirmPassword("");
    }, [user, openProfileModal]);

    const handleClick = () => {
        setOpenSnackBar(true);
    };

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    async function handleSubmit() {
        if (!user) return;

        if (newPassword && newPassword !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        try {
            const payload: Partial<User> = {
                name,
                email,
            };

            if (newPassword) {
                payload.password = newPassword as any;
            }

            const updated: User = await updateProfileInfo(payload);

            setUser(updated);

            handleClick();
        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar perfil.");
        }
    }

    return (
        <Dialog
            open={openProfileModal}
            onClose={() => setOpenProfileModal(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ fontWeight: "bold" }}>Editar Perfil</DialogTitle>

            <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
                <TextField
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />

                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />

                <TextField
                    label="Nova Senha"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />

                <TextField
                    label="Confirmar Nova Senha"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setOpenProfileModal(false)}>Cancelar</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Salvar
                </Button>
            </DialogActions>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleClose}
                message="Edição realizada com sucesso"
                action={<>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>}
            />
        </Dialog>
    );
}
