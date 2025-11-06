"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvailableDates } from "../../../agendar/_actions/get-available-dates";

interface CalendarViewProps {
  professionalId: string;
  availableTimes: string[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function CalendarView({
  professionalId,
  availableTimes,
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar datas disponíveis ao montar ou mudar mês
  useEffect(() => {
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    let endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Ajustar para não incluir datas passadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      startDate.setTime(today.getTime());
    }

    // Expandir até o final do ano se necessário
    const endOfYear = new Date();
    endOfYear.setMonth(11); // Dezembro
    endOfYear.setDate(31);
    endOfYear.setHours(23, 59, 59, 999);
    
    // Usar o maior entre endDate do mês e fim do ano
    if (endDate > endOfYear || !maxDate) {
      endDate = endOfYear;
    } else if (maxDate && endDate > maxDate) {
      endDate = maxDate;
    }

    setIsLoading(true);
    getAvailableDates({
      userId: professionalId,
      startDate,
      endDate,
      availableTimes,
    })
      .then((dates) => {
        setAvailableDates(dates);
      })
      .catch((error) => {
        console.error("Erro ao buscar datas disponíveis:", error);
        setAvailableDates([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentMonth, professionalId, availableTimes, maxDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days: Date[] = [];
  const currentDate = new Date(startDate);

  while (days.length < 42) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const isDateAvailable = (date: Date): boolean => {
    // Comparar apenas a parte da data (YYYY-MM-DD) sem considerar timezone
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return availableDates.includes(dateKey);
  };

  const isDateDisabled = (date: Date): boolean => {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    // Desabilitar se for antes de hoje
    if (dateOnly < today) return true;

    // Desabilitar se for depois de maxDate
    if (maxDate) {
      const maxDateOnly = new Date(maxDate);
      maxDateOnly.setHours(0, 0, 0, 0);
      if (dateOnly > maxDateOnly) return true;
    }

    // Desabilitar se não tiver horários disponíveis
    if (availableTimes.length === 0) return true;

    // Desabilitar se não estiver na lista de datas disponíveis
    return !isDateAvailable(date);
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      // Criar a chave da data no timezone local para evitar problemas de conversão
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      onDateSelect(dateKey);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isCurrentMonth = (date: Date): boolean => {
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    // Comparar apenas a parte da data (YYYY-MM-DD) sem considerar timezone
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return dateKey === selectedDate;
  };

  return (
    <div className="w-full relative z-10">
      {/* Instrução */}
      <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-700">
          💡 <strong>Dica:</strong> Clique em uma data <span className="bg-emerald-50 text-emerald-700 px-1 rounded">verde</span> para ver os horários disponíveis. Datas em <span className="opacity-40">cinza</span> estão indisponíveis.
        </p>
      </div>
      
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0"
          disabled={isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-lg">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0"
          disabled={isLoading || (maxDate && currentMonth.getMonth() >= maxDate.getMonth() && currentMonth.getFullYear() >= maxDate.getFullYear())}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de Dias */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateKey = date.toISOString().split("T")[0];
          const disabled = isDateDisabled(date);
          const available = isDateAvailable(date);
          const selected = isSelected(date);
          const isCurrent = isCurrentMonth(date);
          const isTodayDate = isToday(date);

          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDateClick(date);
              }}
              disabled={disabled}
              className={cn(
                "relative h-10 w-full rounded-md text-sm transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1",
                !isCurrent && "text-muted-foreground/50",
                disabled && "cursor-not-allowed opacity-40",
                !disabled && "hover:bg-accent hover:text-accent-foreground",
                // Data disponível
                available &&
                  !selected &&
                  !disabled &&
                  "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                // Data selecionada
                selected &&
                  "bg-emerald-500 text-white hover:bg-emerald-600 font-semibold",
                // Data de hoje
                isTodayDate &&
                  !selected &&
                  "ring-2 ring-emerald-500 ring-offset-1"
              )}
              style={{ pointerEvents: disabled ? 'none' : 'auto', zIndex: 10 }}
            >
              {date.getDate()}
              {/* Indicador de disponibilidade */}
              {available && !selected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-emerald-50 border border-emerald-200" />
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-emerald-500" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md border-2 border-emerald-500" />
          <span>Hoje</span>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            <span>Carregando disponibilidade...</span>
          </div>
        )}
      </div>
    </div>
  );
}

