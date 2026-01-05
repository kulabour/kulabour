import React from 'react';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { cn } from '../../utils/cn';

interface ChatBubbleProps {
    message: string;
    isSent: boolean;
    timestamp: string;
}

export const ChatBubble = ({ message, isSent, timestamp }: ChatBubbleProps) => {
    return (
        <Box
            className={cn(
                "mb-md max-w-[80%] rounded-2xl p-md shadow-sm",
                isSent
                    ? "bg-brand-primary self-end rounded-tr-none"
                    : "bg-surface-subtle self-start rounded-tl-none border border-border-subtle"
            )}
        >
            <Text
                variant="body"
                className={cn(
                    "mb-xs",
                    isSent ? "text-white" : "text-text-primary"
                )}
            >
                {message}
            </Text>
            <Text
                variant="caption"
                className={cn(
                    "text-[10px]",
                    isSent ? "text-white/70" : "text-text-tertiary"
                )}
            >
                {timestamp}
            </Text>
        </Box>
    );
};
