/**
 * Calcula todos os slots de tempo que serão ocupados por um serviço
 * baseado no horário inicial e na duração do serviço.
 * 
 * @param startTime - Horário inicial no formato "HH:MM" (ex: "08:00")
 * @param durationMinutes - Duração do serviço em minutos (ex: 60 para 1 hora)
 * @param slotInterval - Intervalo entre slots em minutos (padrão: 30)
 * @returns Array de horários que serão ocupados (ex: ["08:00", "08:30"] para 60min)
 */
export function calculateTimeSlots(
  startTime: string,
  durationMinutes: number,
  slotInterval: number = 30
): string[] {
  const slots: string[] = [];
  const [hours, minutes] = startTime.split(":").map(Number);
  
  // Quantidade de slots necessários (arredondar para cima)
  const slotsNeeded = Math.ceil(durationMinutes / slotInterval);
  
  // Adicionar cada slot
  for (let i = 0; i < slotsNeeded; i++) {
    const slotMinutes = minutes + (i * slotInterval);
    const slotHours = hours + Math.floor(slotMinutes / 60);
    const finalMinutes = slotMinutes % 60;
    
    const slotTime = `${String(slotHours).padStart(2, "0")}:${String(finalMinutes).padStart(2, "0")}`;
    slots.push(slotTime);
  }
  
  return slots;
}

/**
 * Verifica se um horário está disponível considerando a duração do serviço
 * e os horários já ocupados.
 * 
 * @param startTime - Horário inicial no formato "HH:MM"
 * @param durationMinutes - Duração do serviço em minutos
 * @param occupiedTimes - Array de horários já ocupados
 * @param availableTimes - Array de horários disponíveis do profissional
 * @returns true se o horário está disponível, false caso contrário
 */
export function isTimeSlotAvailable(
  startTime: string,
  durationMinutes: number,
  occupiedTimes: string[],
  availableTimes: string[]
): boolean {
  // Calcular todos os slots necessários
  const requiredSlots = calculateTimeSlots(startTime, durationMinutes);
  
  // Verificar se todos os slots necessários estão disponíveis
  for (const slot of requiredSlots) {
    // Verificar se o slot está na lista de horários disponíveis do profissional
    if (!availableTimes.includes(slot)) {
      return false;
    }
    
    // Verificar se o slot já está ocupado
    if (occupiedTimes.includes(slot)) {
      return false;
    }
  }
  
  return true;
}
