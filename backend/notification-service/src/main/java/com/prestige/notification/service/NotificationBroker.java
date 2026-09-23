package com.prestige.notification.service;
import com.prestige.notification.api.NotificationResponse; import java.io.IOException; import java.util.*; import java.util.concurrent.*; import org.springframework.scheduling.annotation.Scheduled; import org.springframework.stereotype.Component; import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
@Component public class NotificationBroker {
 private final Map<Long,Set<SseEmitter>> clients=new ConcurrentHashMap<>();
 public SseEmitter connect(Long customerId){ SseEmitter emitter=new SseEmitter(0L); clients.computeIfAbsent(customerId,k->ConcurrentHashMap.newKeySet()).add(emitter); Runnable close=()->remove(customerId,emitter); emitter.onCompletion(close);emitter.onTimeout(close);emitter.onError(e->remove(customerId,emitter)); return emitter; }
 public void publish(Long customerId,NotificationResponse notification){ for(SseEmitter e:clients.getOrDefault(customerId,Set.of())) send(e,notification); }
 private void send(SseEmitter e,NotificationResponse n){try{e.send(SseEmitter.event().id(n.id().toString()).name("notification").data(n));}catch(IOException ex){clients.values().forEach(s->s.remove(e));}}
 private void remove(Long id,SseEmitter e){Set<SseEmitter>s=clients.get(id);if(s!=null)s.remove(e);}
 @Scheduled(fixedDelay=25000) public void heartbeat(){for(Set<SseEmitter> set:clients.values())for(SseEmitter e:set)try{e.send(SseEmitter.event().comment("keepalive"));}catch(IOException ex){set.remove(e);}}
}
