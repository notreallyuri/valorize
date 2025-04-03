"use client";
import React from "react";
import {
  useForm,
  useFieldArray,
  FieldError,
  FormProvider,
} from "react-hook-form";
import { Input } from "@/components/Default/input";
import { Select } from "@/components/Default/select";
import { AppError } from "@acme/error";

type Field = {
  key: string;
  type: "string" | "number" | "array" | "boolean" | "object";
};

type FormValues = {
  name: string;
  version: string;
  structure: Field[];
};

export default function CreateTemplateForm() {
  const methods = useForm<FormValues>({
    defaultValues: {
      name: "",
      version: "",
      structure: [{ key: "", type: "string" }],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "structure",
  });

  const typeOptions = [
    { value: "string", label: "String" },
    { value: "number", label: "Number" },
    { value: "array", label: "Array" },
    { value: "boolean", label: "Boolean" },
    { value: "object", label: "Object" },
  ];

  const onSubmit = async (data: FormValues) => {
    const structureObj = data.structure.reduce<Record<string, string>>(
      (acc, field) => {
        if (field.key.trim()) {
          acc[field.key.trim()] = field.type;
        }
        return acc;
      },
      {},
    );

    try {
      const res = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          version: data.version,
          structure: structureObj,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new AppError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error,
        });
      }
      reset();
      alert("Template created successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      alert(message);
    }
  };

  return (
    <main className="flex h-full w-full flex-col items-center py-4 pt-20">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg rounded-lg border border-black/20 p-4 shadow-md"
        >
          <h1 className="mb-4 text-2xl font-bold">Criar Template</h1>

          <div className="mb-4">
            <Input
              label="Nome do template"
              id="name"
              type="text"
              placeholder="Insira um nome para o template"
              {...register("name", { required: "Template name is required" })}
              error={errors.name?.message}
            />
          </div>

          <div className="mb-4">
            <Input
              label="Versão"
              id="version"
              type="text"
              placeholder="e.g., 1.0.0"
              {...register("version", {
                required: "Version is required",
                pattern: {
                  value: /^\d+\.\d+\.\d+$/,
                  message:
                    "Invalid version format. Use semantic versioning (e.g., 1.0.0)",
                },
              })}
              error={errors.version?.message}
            />
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-xl font-semibold">Estrutura</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-2 flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label="Nome do campo"
                    {...register(`structure.${index}.key`, {
                      required: "Field name is required",
                    })}
                    error={errors.structure?.[index]?.key?.message}
                  />
                </div>

                <div className="w-40">
                  <Select
                    label="Tipo"
                    name={`structure.${index}.type`}
                    options={typeOptions}
                    defaultValue="string"
                    error={
                      (
                        errors.structure?.[index]?.type as
                          | FieldError
                          | undefined
                      )?.message
                    }
                  />
                </div>

                <button
                  type="button"
                  className="h-11 rounded-xl bg-indigo-800 px-2 font-medium text-white hover:bg-indigo-700"
                  onClick={() => remove(index)}
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ key: "", type: "string" })}
              className="rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Adicionar campo
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-500 py-2 text-white hover:bg-indigo-600"
          >
            Create Template
          </button>
        </form>
      </FormProvider>
    </main>
  );
}
