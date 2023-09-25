package com.twinkle.shopapp.configuration;

import com.twinkle.shopapp.filters.JwtTokenFilter;
import com.twinkle.shopapp.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;
import java.util.List;


@Configuration
//@EnableMethodSecurity
@EnableWebSecurity
@EnableWebMvc
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtTokenFilter jwtTokenFilter;

    // Các request gửi tới phải dc phân quyền, ms dc pass qua

    @Bean // Kiểm tra quyền là gì
    public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception{

        // Authorization (Phân quyền)
        http
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(requests ->{
                    requests.requestMatchers("api/v1/users/register",
                                                "api/v1/users/login")
                            .permitAll()        // Cho hết tất cả các role
                            // chỉ định các role dc truy cập vào API

                            .requestMatchers(HttpMethod.GET,
                                    "api/v1/users/**").permitAll()

                            .requestMatchers(HttpMethod.POST,
                                    "api/v1/users/**").permitAll()

                            .requestMatchers(HttpMethod.GET,
                                    "api/v1/roles**").permitAll()

                            .requestMatchers(HttpMethod.POST,
                                    "api/v1/categories/**").hasAnyRole(Role.ADMIN)

                            .requestMatchers(HttpMethod.PUT,
                                    "api/v1/categories/**").hasAnyRole(Role.ADMIN)

                            .requestMatchers(HttpMethod.DELETE,
                                    "api/v1/categories/**").hasAnyRole(Role.ADMIN)

                            .requestMatchers(HttpMethod.GET,
                                    "api/v1/categories**").permitAll()

                            .requestMatchers(HttpMethod.POST,
                                    "api/v1/products**").hasRole(Role.ADMIN)

                            .requestMatchers(HttpMethod.PUT,
                                    "api/v1/products/**").hasAnyRole(Role.ADMIN)

                            .requestMatchers(HttpMethod.DELETE,
                                    "api/v1/products/**").hasAnyRole(Role.ADMIN)

                            .requestMatchers(HttpMethod.GET,
                                    "api/v1/products/**").permitAll()

                            .requestMatchers(HttpMethod.GET,
                                    "api/v1/products/images/*").permitAll()

                            .requestMatchers(HttpMethod.POST,
                                    "api/v1/orders/**").permitAll()

                            .requestMatchers(HttpMethod.GET,
                                    "api/v1/orders/**").hasAnyRole(Role.USER, Role.ADMIN)

                            .requestMatchers(HttpMethod.PUT,
                                    "api/v1/orders/**").hasRole(Role.ADMIN)

                            .requestMatchers(HttpMethod.DELETE,
                                    "api/v1/orders/**").hasRole(Role.ADMIN)

                            .requestMatchers(HttpMethod.POST,
                                    "api/v1/order_details/**").hasAnyRole(Role.USER, Role.ADMIN)

                            .requestMatchers(HttpMethod.GET,
                                    "api/v1/order_details/**").hasAnyRole(Role.USER, Role.ADMIN)

                            .requestMatchers(HttpMethod.PUT,
                                    "api/v1/order_details/**").hasRole(Role.ADMIN)

                            .requestMatchers(HttpMethod.DELETE,
                                    "api/v1/order_details/**").hasRole(Role.ADMIN)

                            .anyRequest().authenticated();
                }).csrf(AbstractHttpConfigurer::disable);


        // server cho phép client nào gửi tới api nào cx dc
        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
            @Override
            public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("*"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
                configuration.setExposedHeaders(List.of("x-auth-token"));
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                httpSecurityCorsConfigurer.configurationSource(source);
            }
        });
                return http.build();
    }


}
