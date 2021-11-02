import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="absolute top-6 right-8 z-50">
      <Link href="/">
        <a className="flex items-center">
          <Image
            src="/dovetail-icon.svg"
            width={30.4}
            height={32}
            alt="Dovetail icon"
          />
          <h1 className="text-4xl ml-2 -mt-1">Goals</h1>
        </a>
      </Link>
    </div>
  );
}
