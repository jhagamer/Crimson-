
export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Crimson Cosmetics. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Premium Beauty, Exquisite Style.
        </p>
      </div>
    </footer>
  );
}
