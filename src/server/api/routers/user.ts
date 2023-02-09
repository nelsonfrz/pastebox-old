import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserData: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        }
      });
      if (user) {
        return {
          id: user.id,
          name: user.name,
          image: user.image,
        };
      }
    }),

  getUserPastes: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const pastes = await ctx.prisma.paste.findMany({
        orderBy: {
          date: 'desc'
        },
        where: {
          userId: input.id,
        }
      });
      return {
        pastes
      };
    }),
});
