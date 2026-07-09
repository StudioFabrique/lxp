type Props = {
  children: React.ReactNode;
};

function ListHeader({ children }: Props) {
  return (
    <main className="w-full flex flex-col items-center gap-8">{children}</main>
  );
}

export default ListHeader;
