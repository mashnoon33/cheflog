
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen  w-full flex-col ">
      <Header />
      {/* <SearchPallete /> */}
      <div className="dark:bg-main flex flex-1 w-full">
        {children}
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-10 h-[65px] w-full flex-none border-b border-neutral-700/10 bg-blend-darken backdrop-blur dark:border-neutral-800 dark:bg-blend-lighten lg:z-50">
      <div className="mx-auto flex h-full items-center justify-between px-4 sm:px-2 md:px-8 lg:px-8">
        <div className="mt-1">
          {/* <FiSun fontSize="24px" /> */}
          {/* <ThemeSwitch /> */}
        </div>
        <Link href="/">
          <Logo variant="small" />
        </Link>
        {/* {router.pathname.endsWith('admin') ? (3
      <button
        className=" btn btn-xs btn-outline my-0 mr-2"
        onClick={() => console.log('Login')}
      >
        {false ? 'Logout' : 'Login'}
      </button>
    ) : (
      <button
        className=" btn btn-sm  btn-ghost  my-0 "
        // Onclick broadclast the showPallete event
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent('showPallete', { bubbles: true }),
          );
        }}
      >
        <MdSearch fontSize="24px" />
      </button>
    )} */}
        <div></div>
        {/* <MdSearch fontSize="24px" /> */}
      </div>
    </header>
  );
}
