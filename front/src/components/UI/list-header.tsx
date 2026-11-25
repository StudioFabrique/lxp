import PageWrapper from "../wrappers/PageWrapper";

type Props = {
  children: React.ReactNode;
};

function ListHeader({ children }: Readonly<Props>) {
  return (
    <PageWrapper as="main" className="items-center">
      {children}
    </PageWrapper>
  );
}

export default ListHeader;
