"use client"
import Image from "next/image";
import {Test} from "@/app/test/Test";
import {useSearchParams} from "next/navigation";

export default function Home() {
    const params = useSearchParams()
  return <div>
      <Test username={params.get('name') || 'test'} color={params.get('color') || 'red'} />
  </div>
}
