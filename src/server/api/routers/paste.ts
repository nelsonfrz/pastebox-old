import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const pasteRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const paste = await ctx.prisma.paste.findFirst({
        where: {
          id: input.id
        }
      });
      return {
        paste,
      };
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const pastes = await ctx.prisma.paste.findMany({
        where: {
          userId: ctx.session.user.id
        }
      });
      return {
        pastes,
      };
    }),

  create: protectedProcedure
    .input(z.object({ 
      title: z.string().trim().min(1).max(100),
      content: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const paste = await ctx.prisma.paste.create({
        data:{
          title: input.title,
          content: input.content,
          userId: ctx.session.user.id
        }
      });
      return paste;
    }),

  edit: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      title: z.string().trim().min(1),
      content: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const paste = await ctx.prisma.paste.findFirst({
        where: {
          id: input.id
        }
      });

      if (paste?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not able to edit pastes from different users.'})
      } 

      await ctx.prisma.paste.update({
        where: {
          id: input.id
        },
        data: {
          title: input.title,
          content: input.content,
        }
      })
      return paste;
    }),

  delete: protectedProcedure
    .input(z.object({ 
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const paste = await ctx.prisma.paste.findFirst({
        where: {
          id: input.id
        }
      });

      if (paste?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not able to delete pastes from different users.'})
      } 

      await ctx.prisma.paste.delete({
        where: {
          id: input.id
        }
      })
    }),
});
