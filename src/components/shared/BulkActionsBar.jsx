import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, Trash2, CheckCircle, XCircle, Mail } from 'lucide-react';
export function BulkActionsBar({ selectedCount, onClear, onExport, onDelete, onApprove, onReject, onSendEmail, actions = ['export', 'delete'], }) {
    return (<AnimatePresence>
      {selectedCount > 0 && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 px-6 py-3 bg-card border rounded-full shadow-lg">
            {/* Selected Count */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-semibold">
                {selectedCount} selected
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClear}>
                <X className="h-4 w-4"/>
              </Button>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-border"/>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {actions.includes('export') && onExport && (<Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2"/>
                  Export
                </Button>)}

              {actions.includes('email') && onSendEmail && (<Button variant="outline" size="sm" onClick={onSendEmail}>
                  <Mail className="h-4 w-4 mr-2"/>
                  Email
                </Button>)}

              {actions.includes('approve') && onApprove && (<Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={onApprove}>
                  <CheckCircle className="h-4 w-4 mr-2"/>
                  Approve
                </Button>)}

              {actions.includes('reject') && onReject && (<Button variant="outline" size="sm" className="text-orange-600 hover:text-orange-700" onClick={onReject}>
                  <XCircle className="h-4 w-4 mr-2"/>
                  Reject
                </Button>)}

              {actions.includes('delete') && onDelete && (<Button variant="destructive" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2"/>
                  Delete
                </Button>)}
            </div>
          </div>
        </motion.div>)}
    </AnimatePresence>);
}
