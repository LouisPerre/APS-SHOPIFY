import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

interface AuthModalProps {
    children: React.ReactNode;
}

export const AuthModal: React.FC<AuthModalProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('')

        try {
            if (isSignup) {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setMessage("Verifier votre email pour confirmer votre inscription !");
            } else {
                const { error } = await signIn(email, password);
                if (error) throw error;
                setIsOpen(false);
            }
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px">
                <DialogHeader>
                    <DialogTitle>
                        { isSignup ? 'Creer un compte' : 'Se connecter' }
                    </DialogTitle>
                    <DialogDescription>
                        { isSignup
                            ? 'Creer un compte pour suivre vos commandes'
                            : 'Connecter-vous a votre compte'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>

                    {message && (
                        <div className={`text-sm ${message.includes('Vérifiez') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Chargement...' : (isSignup ? 'Creer un compte' : 'Se connecter')}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup
                            ? 'Déjà un compte ? Se connecter'
                            : 'Pas de compte ? Créer un compte'
                        }
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
