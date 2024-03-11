import { describe, expect } from "vitest"
import sum from "@/index"

describe("Sum",(it)=>{
  it("should return 3",()=>{
    expect(sum(1,2)).toBe(3)
  })
})