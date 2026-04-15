import React from 'react';
import { X, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Book } from '@/hooks/useBooks';

interface SamplePdfViewerProps {
  book: Book;
  open: boolean;
  onClose: () => void;
  onRent: () => void;
}

const SamplePdfViewer: React.FC<SamplePdfViewerProps> = ({ book, open, onClose, onRent }) => {

  // Generate sample paragraph text based on book description
  const sampleParagraphs = [
    book.description || 'No description available.',
    `"${book.title}" is a remarkable work by ${book.author} that has captivated readers around the world. This book takes you on an unforgettable journey through its pages.`,
    `${book.author} masterfully crafts a narrative that keeps readers engaged from the very first page. The themes explored in this book resonate deeply with readers of all backgrounds.`,
    `As you delve deeper into "${book.title}", you will find yourself immersed in a world carefully constructed by ${book.author}. Every chapter brings new insights and revelations.`,
    `The story continues to unfold with remarkable depth and nuance. ${book.author}'s writing style is both accessible and profound, making this an essential read.`,
    `This chapter explores the central themes of the book in greater detail. The narrative builds momentum as we approach the heart of the story.`,
    `Readers have praised "${book.title}" for its thoughtful exploration of complex ideas. ${book.author} demonstrates a masterful command of the subject matter throughout.`,
  ];

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

            {/* Page 1 — Cover */}
            <div className="bg-card rounded-lg shadow-card p-8 min-h-[400px] flex flex-col">
              <div className="text-xs text-muted-foreground mb-4">Page 1</div>
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-32 h-48 object-cover rounded-md shadow-book"
                />
                <h2 className="text-2xl font-display font-bold">{book.title}</h2>
                <p className="text-muted-foreground">by {book.author}</p>
                <p className="text-sm text-muted-foreground italic">Sample Preview — First 10 Pages</p>
              </div>
            </div>

            {/* Page 2 — About */}
            <div className="bg-card rounded-lg shadow-card p-8 min-h-[400px] flex flex-col">
              <div className="text-xs text-muted-foreground mb-4">Page 2</div>
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-lg font-display font-semibold">About This Book</h3>
                <p className="text-foreground leading-relaxed">{book.description}</p>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Book Details</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>Author: {book.author}</p>
                    <p>Category: {book.category}</p>
                    <p>Price: ₹{book.price}</p>
                    {book.rating && <p>Rating: ⭐ {book.rating} / 5</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Page 3 — Table of Contents */}
            <div className="bg-card rounded-lg shadow-card p-8 min-h-[400px] flex flex-col">
              <div className="text-xs text-muted-foreground mb-4">Page 3</div>
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-lg font-display font-semibold">Table of Contents</h3>
                <div className="space-y-3 mt-2">
                  {[
                    'Introduction',
                    'Chapter 1 — The Beginning',
                    'Chapter 2 — Rising Action',
                    'Chapter 3 — The Turning Point',
                    'Chapter 4 — Into the Unknown',
                    'Chapter 5 — Revelations',
                    'Chapter 6 — The Climax',
                    'Chapter 7 — Resolution',
                    'Chapter 8 — New Beginnings',
                    'Epilogue',
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-border/50">
                      <span className="text-sm text-foreground">{item}</span>
                      <span className="text-xs text-muted-foreground">{10 + i * 12}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pages 4–10 — Sample Chapters */}
            {[
              { page: 4, title: 'Introduction', idx: 0 },
              { page: 5, title: 'Chapter 1 — The Beginning', idx: 1 },
              { page: 6, title: 'Chapter 2 — Rising Action', idx: 2 },
              { page: 7, title: 'Chapter 3 — The Turning Point', idx: 3 },
              { page: 8, title: 'Chapter 4 — Into the Unknown', idx: 4 },
              { page: 9, title: 'Chapter 5 — Revelations', idx: 5 },
              { page: 10, title: 'Chapter 6 — The Climax', idx: 6 },
            ].map(({ page, title, idx }) => (
              <div key={page} className="bg-card rounded-lg shadow-card p-8 min-h-[400px] flex flex-col">
                <div className="text-xs text-muted-foreground mb-4">Page {page}</div>
                <div className="flex-1 flex flex-col gap-4">
                  <h3 className="text-lg font-display font-semibold">{title}</h3>
                  <p className="text-foreground leading-relaxed">
                    {sampleParagraphs[idx] || sampleParagraphs[0]}
                  </p>
                  <p className="text-foreground leading-relaxed">
                    The journey through these pages offers readers a unique perspective on the
                    world crafted by {book.author}. Each paragraph draws you deeper into the
                    narrative, leaving you eager to discover what comes next.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    As this sample preview comes to a close, we hope you have enjoyed this
                    glimpse into "{book.title}". Rent the full book to continue this remarkable journey.
                  </p>
                </div>
              </div>
            ))}

            {/* Locked overlay */}
            <div className="bg-card rounded-lg shadow-card p-8 min-h-[300px] flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-primary/30">
              <Lock className="w-12 h-12 text-primary/50" />
              <h3 className="text-xl font-display font-bold">Sample Preview Ended</h3>
              <p className="text-muted-foreground max-w-md">
                You've reached the end of the free preview. Rent "{book.title}" to continue reading the full book.
              </p>
              <Button
                onClick={onRent}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
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
