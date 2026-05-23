"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/admin/ui/button";

export function StickySaveBar({
  visible,
  pending,
  onSave,
  onDiscard,
  message,
}: {
  visible: boolean;
  pending?: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  message?: string;
}) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-full border border-admin-border bg-admin-surface px-4 py-2 shadow-lift">
            <span className="text-[12px] text-admin-fg-muted">{message ?? "You have unsaved changes"}</span>
            {onDiscard ? (
              <Button variant="ghost" size="xs" onClick={onDiscard}>
                Discard
              </Button>
            ) : null}
            <Button variant="primary" size="xs" onClick={onSave} disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
