'use client'

import { useCallback, useRef, useState, useEffect } from "react";
import { X, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from 'cmdk';
import { User } from "@/types/user";

interface MultiSelectProps {
    currentUser: User;
    allUsers: User[];
    onChange: (selectedUsers: string[]) => void;
    value?: string[];  // Add value prop to control selected users externally
}

export default function MultiSelect({ currentUser, allUsers, onChange, value }: MultiSelectProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<User[]>([]);
    const [inputValue, setInputValue] = useState("");

    // Sync selected state with external value prop
    useEffect(() => {
        if (value) {
            const selectedUsers = allUsers.filter(user => value.includes(user.id));
            setSelected(selectedUsers);
        }
    }, [value, allUsers]);

    const handleUnselect = useCallback((user: User) => {
        if (user.id === currentUser.id) return;
        
        const newSelected = selected.filter((s) => s.id !== user.id);
        setSelected(newSelected);
        onChange(newSelected.map(u => u.id));
    }, [onChange, currentUser.id, selected]);

    const handleSelect = useCallback((user: User) => {
        setInputValue("");
        if (selected.some(selectedUser => selectedUser.id === user.id)) {
            return;
        }
        const newSelected = [...selected, user];
        setSelected(newSelected);
        onChange(newSelected.map(u => u.id));
    }, [onChange, selected]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "" && selected.length > 0) {
                    const newSelected = selected.slice(0, -1);
                    setSelected(newSelected);
                    onChange(newSelected.map(u => u.id));
                }
            }
            if (e.key === "Escape") {
                input.blur();
            }
        }
    }, [onChange, selected]);

    const selectables = allUsers.filter(
        (user) => 
            user.id !== currentUser.id && 
            !selected.some(selectedUser => selectedUser.id === user.id)
    );
    
    return (
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    <Badge key={currentUser.id} variant="secondary" className="bg-secondary/50">
                        {currentUser.name} (Admin)
                        <Lock className="ml-1 h-3 w-3 text-muted-foreground" />
                    </Badge>
                    {selected.map((user) => (
                        <Badge key={user.id} variant="secondary">
                            {user.name}
                            <button
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUnselect(user);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(user)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Add team members..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open && selectables.length > 0 && (
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandList>
                            <CommandGroup className="h-full overflow-auto">
                                {selectables.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => handleSelect(user)}
                                        className="cursor-pointer"
                                    >
                                        {user.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </div>
                )}
            </div>
        </Command>
    );
}