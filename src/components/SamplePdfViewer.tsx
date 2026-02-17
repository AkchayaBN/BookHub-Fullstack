import React from 'react';
import { X, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Book } from '@/types/book';

interface SamplePdfViewerProps {
  book: Book;
  open: boolean;
  onClose: () => void;
  onRent: () => void;
}

const SamplePdfViewer: React.FC<SamplePdfViewerProps> = ({ book, open, onClose, onRent }) => {
  const samplePages = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {book.title} — Sample Preview
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <div className="max-w-2xl mx-auto space-y-8">
            {samplePages.map((page) => (
              <div
                key={page}
                className="bg-card rounded-lg shadow-card p-8 min-h-[400px] flex flex-col"
              >
                <div className="text-xs text-muted-foreground mb-4">Page {page}</div>
                {page === 1 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-32 h-48 object-cover rounded-md shadow-book"
                    />
                    <h2 className="text-2xl font-display font-bold">{book.title}</h2>
                    <p className="text-muted-foreground">by {book.author}</p>
                    <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>
                  </div>
                ) : page === 2 ? (
                  <div className="flex-1 flex flex-col gap-4">
                    <h3 className="text-lg font-display font-semibold">About This Book</h3>
                    <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                    <div className="mt-auto text-sm text-muted-foreground">
                      <p>Published: {book.publicationYear} | Pages: {book.pages} | Language: {book.language}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-display font-semibold">
                      {page === 3 ? 'Table of Contents' : `Chapter ${page - 3}`}
                    </h3>
                    {Array.from({ length: 6 + Math.floor(Math.random() * 4) }, (_, i) => (
                      <div key={i} className="h-3 bg-muted rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                    ))}
                    <div className="h-3 bg-muted rounded" style={{ width: '45%' }} />
                    {page > 5 && (
                      <>
                        <div className="h-6" />
                        {Array.from({ length: 4 + Math.floor(Math.random() * 3) }, (_, i) => (
                          <div key={`p2-${i}`} className="h-3 bg-muted rounded" style={{ width: `${55 + Math.random() * 45}%` }} />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Locked overlay after sample */}
            <div className="bg-card rounded-lg shadow-card p-8 min-h-[300px] flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-primary/30">
              <Lock className="w-12 h-12 text-primary/50" />
              <h3 className="text-xl font-display font-bold">Sample Preview Ended</h3>
              <p className="text-muted-foreground max-w-md">
                You've reached the end of the free preview. Rent this book to continue reading all {book.pages} pages.
              </p>
              <Button onClick={onRent} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Rent This Book
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SamplePdfViewer;
